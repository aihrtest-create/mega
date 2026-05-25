import fitz  # PyMuPDF
import sys
import os
import argparse
from pathlib import Path

def process_pdf(pdf_path):
    if not os.path.exists(pdf_path):
        print(f"Error: File not found - {pdf_path}")
        return
        
    pdf_file = Path(pdf_path)
    base_name = pdf_file.stem
    output_dir = Path("processed_pdfs") / base_name
    images_dir = output_dir / "images"
    pages_dir = output_dir / "pages"
    
    # Create output directories
    output_dir.mkdir(parents=True, exist_ok=True)
    images_dir.mkdir(parents=True, exist_ok=True)
    pages_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Processing '{pdf_path}'...")
    print(f"Output directory: {output_dir}")
    
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    full_text = []
    image_count = 0
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # 1. Extract Text
        text = page.get_text()
        if text.strip():
            full_text.append(f"--- Page {page_num + 1} ---\n{text}\n")
            
        # 2. Extract Images
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                image_count += 1
                image_filename = f"image_p{page_num+1}_{image_count}.{image_ext}"
                image_path = images_dir / image_filename
                
                with open(image_path, "wb") as f:
                    f.write(image_bytes)
            except Exception as e:
                print(f"Warning: Failed to extract image on page {page_num+1}: {e}")
                
        # 3. Render Page as Image (Screenshot)
        # Zoom factor for better resolution (2.0 = 144 DPI)
        zoom = 2.0
        mat = fitz.Matrix(zoom, zoom)
        try:
            pix = page.get_pixmap(matrix=mat, alpha=False)
            page_img_path = pages_dir / f"page_{page_num+1}.png"
            pix.save(str(page_img_path))
        except Exception as e:
            print(f"Warning: Failed to render page {page_num+1}: {e}")
            
    page_count = len(doc)
    doc.close()
    
    # Save full text to file
    text_output_path = output_dir / f"{base_name}_text.md"
    with open(text_output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(full_text))
        
    print(f"\nSuccess! Processed {page_count} pages.")
    print(f"Text saved to: {text_output_path}")
    print(f"Extracted {image_count} embedded images to: {images_dir}")
    print(f"Saved {page_count} page screenshots to: {pages_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract text, images, and page renders from a PDF.")
    parser.add_argument("pdf_path", help="Path to the PDF file to process")
    args = parser.parse_args()
    
    process_pdf(args.pdf_path)
