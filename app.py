from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import cv2
import io
import torch
import numpy as np
import ultralytics.nn.tasks as tasks

# Güvenlik ayarı
torch.serialization.add_safe_globals([tasks.DetectionModel])

app = Flask(__name__)
CORS(app)

# 1. Modelin yüklenmesi (Eğitim sonrası oluşan best.pt buraya yüklenir)
# 'task="detect"' parametresi YOLOv8'in tespit modunda çalışmasını garanti eder
model = YOLO('best.pt') 

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "Görsel bulunamadı"}), 400

    file = request.files['image']
    img_pil = Image.open(file.stream).convert('RGB')
    
    # 2. Tahmin parametrelerini optimize edin
    # conf: Modelin kaçta kaç ihtimalle kırık demesi gerektiğini belirler. 
    results = model.predict(source=img_pil, conf=0.10, imgsz=640)
    result = results[0]

    # 3. Çıktı mantığı
    if len(result.boxes) > 0:
        # Kırık bulunduysa: Kutu içinde göster
        plotted = result.plot()
    else:
        # Kırık yoksa: Orijinal resim + yeşil yazı
        plotted = np.array(img_pil)
        plotted = cv2.cvtColor(plotted, cv2.COLOR_RGB2BGR)
        cv2.putText(plotted, "KIRIK TESPIT EDILMEDI", (50, 100), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 3)

    # 4. Geriye resim olarak gönder
    plotted = cv2.cvtColor(plotted, cv2.COLOR_BGR2RGB)
    output = Image.fromarray(plotted)
    img_io = io.BytesIO()
    output.save(img_io, format='JPEG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/jpeg')

@app.route('/detections', methods=['POST'])
def get_detections():
    file = request.files['image']
    img = Image.open(file.stream).convert('RGB')
    results = model.predict(source=img, conf=0.30)
    
    detections = []
    for box in results[0].boxes:
        detections.append({
            # Modelin eğitildiği sınıfları otomatik alır
            "class": model.names[int(box.cls[0])],
            "confidence": float(box.conf[0]),
            "box": box.xyxy[0].tolist()
        })
    return jsonify(detections)

if __name__ == "__main__":
    app.run(debug=True, port=5000)