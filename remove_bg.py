from rembg import remove
from PIL import Image

for file in ["surprise_balloon_new.png", "pinata_new.png"]:
    input_path = f"/Users/dima/Desktop/DR-construct(Anti)/public/activities/{file}"
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(input_path)
        print(f"Processed {file}")
    except Exception as e:
        print(f"Failed {file}: {e}")
