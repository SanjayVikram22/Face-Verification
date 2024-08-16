from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import os
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Ensure the 'photos' directory exists
os.makedirs('photos', exist_ok=True)


@app.route('/verify', methods=['POST'])
def verify():
    try:
        uploaded_file = request.files.get('uploaded_image')
        captured_file = request.form.get('captured_image')
        name = request.form.get('name')

        if not uploaded_file or not captured_file or not name:
            return jsonify({'error': 'Missing required data'}), 400

        uploaded_image_path = "uploaded_temp.jpg"
        captured_image_path = "captured_temp.jpg"

        # Save the uploaded file temporarily
        uploaded_file.save(uploaded_image_path)

        # Decode and save the captured image temporarily
        img_data = base64.b64decode(captured_file.split(',')[1])
        with open(captured_image_path, "wb") as fh:
            fh.write(img_data)

        # Perform face verification
        result = DeepFace.verify(
            img1_path=uploaded_image_path,
            img2_path=captured_image_path,
            model_name="Facenet"
        )

        print(result)

        # Clean up temporary files
        os.remove(captured_image_path)

        # Save the uploaded image permanently if verification is successful
        if result['verified']:
            photos_dir = 'photos'
            photo_path = os.path.join(photos_dir, f"{name}.jpg")
            os.rename(uploaded_image_path, photo_path)
            status = "1"
        else:
            os.remove(uploaded_image_path)
            status = "0"

        return jsonify({'status': status})

    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
