from flask import Flask, request, jsonify
import face_recognition

app = Flask(__name__)

@app.route('/compare', methods=['POST'])
def compare_faces():
    if 'uploaded' not in request.files or 'stored' not in request.files:
        return jsonify({'error': 'Missing uploaded or stored image'}), 400

    uploaded_file = request.files['uploaded']
    stored_file = request.files['stored']

    uploaded_img = face_recognition.load_image_file(uploaded_file)
    stored_img = face_recognition.load_image_file(stored_file)

    uploaded_encodings = face_recognition.face_encodings(uploaded_img)
    stored_encodings = face_recognition.face_encodings(stored_img)

    if not uploaded_encodings:
        return jsonify({'match': False, 'reason': 'No face in uploaded image'})
    if not stored_encodings:
        return jsonify({'match': False, 'reason': 'No face in stored image'})

    result = face_recognition.compare_faces([stored_encodings[0]], uploaded_encodings[0])

    return jsonify({'match': bool(result[0])})

if __name__ == '__main__':
    app.run(port=5000)
