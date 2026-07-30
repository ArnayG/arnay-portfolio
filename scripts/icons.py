#!/usr/bin/env python3
"""Generate favicon.ico and apple-icon.png from src/app/icon.svg.

    python3 scripts/icons.py

Run it after editing icon.svg, which is the source of truth for the mark. Uses
sips, so this is macOS only; on anything else, rasterise the SVG with whatever
is at hand and feed the PNGs to build_ico below.

The 16px entry of the .ico is not icon.svg. The rosette needs roughly 20 device
pixels of diameter before the weave is anything but grey, so the smallest size
gets the medallion with the weave dropped: a ring, the clear centre and the
registration marks. Everything larger carries the real figure. Serving
different art per size is the one thing the .ico container is good for.
"""

import pathlib
import re
import struct
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
APP = ROOT / "src" / "app"
SOURCE = APP / "icon.svg"

# Light polarity: an .ico cannot answer to prefers-color-scheme, and a white
# card on a dark tab strip is the convention every other favicon follows.
SMALL_ART = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" fill="#ffffff"/>
  <g fill="none" stroke="#0a0a0a">
    <path d="M2 6V2h4M26 2h4v4M30 26v4h-4M6 30H2v-4" stroke-width="1.6"/>
    <g transform="translate(16 16)">
      <circle r="11.6" stroke-width="2.2"/>
      <circle r="4" stroke-width="1.6"/>
    </g>
  </g>
</svg>
"""

# (size, art) for each image in the .ico, smallest first.
ICO_SIZES = [(16, "small"), (32, "full"), (48, "full")]
APPLE_SIZE = 180


DIMENSIONS = re.compile(r'width="\d+" height="\d+"')


def rasterise(svg: pathlib.Path, size: int, out: pathlib.Path) -> bytes:
    """SVG to PNG at size x size.

    The art declares width and height of 32, and sips rasterises at whatever
    the file says before resampling to the requested width. Asked for 180 it
    therefore renders 32 pixels and blows them up, which turns the rosette to
    mush. Rewriting the root dimensions first makes it rasterise at full size.
    """
    scaled = out.with_suffix(".svg")
    art, count = DIMENSIONS.subn(f'width="{size}" height="{size}"', svg.read_text(), count=1)
    if count != 1:
        raise SystemExit(f"could not find the root dimensions in {svg}")
    scaled.write_text(art)

    subprocess.run(
        ["sips", "-s", "format", "png", "--resampleWidth", str(size),
         str(scaled), "--out", str(out)],
        check=True, capture_output=True,
    )
    data = out.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit(f"sips produced something that is not a PNG at {size}px")
    width, height = struct.unpack(">II", data[16:24])
    if (width, height) != (size, size):
        raise SystemExit(f"expected {size}x{size} from sips, got {width}x{height}")
    return data


def build_ico(images: list[tuple[int, bytes]]) -> bytes:
    """An ICONDIR, one ICONDIRENTRY per image, then the PNG payloads.

    PNG-compressed entries are read by every browser and by Windows Vista and
    later, and keep the file a fraction of the size of the BMP form.
    """
    offset = 6 + 16 * len(images)
    entries, payload = b"", b""
    for size, data in images:
        entries += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(data), offset)
        payload += data
        offset += len(data)
    return struct.pack("<HHH", 0, 1, len(images)) + entries + payload


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"missing {SOURCE}")

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp = pathlib.Path(tmpdir)
        small = tmp / "small.svg"
        small.write_text(SMALL_ART)
        art = {"full": SOURCE, "small": small}

        images = [
            (size, rasterise(art[which], size, tmp / f"{size}.png"))
            for size, which in ICO_SIZES
        ]
        ico = build_ico(images)
        (APP / "favicon.ico").write_bytes(ico)

        apple = rasterise(SOURCE, APPLE_SIZE, tmp / "apple.png")
        (APP / "apple-icon.png").write_bytes(apple)

    sizes = ", ".join(f"{size}px {which}" for size, which in ICO_SIZES)
    print(f"favicon.ico  {len(ico):>6} bytes  ({sizes})")
    print(f"apple-icon.png {len(apple):>6} bytes  ({APPLE_SIZE}px full)")


if __name__ == "__main__":
    sys.exit(main())
