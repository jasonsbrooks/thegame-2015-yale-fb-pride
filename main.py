# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, make_response, send_file
import urllib, io
import HTMLParser

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/serve')
def serve():
    h = HTMLParser.HTMLParser()
    image_url = h.unescape(request.args.get('url'))
    buf = io.BytesIO()
    buf.write(urllib.urlopen(image_url).read())
    buf.seek(0)
    return send_file(buf, attachment_filename="prof.png", mimetype="image/png")

# Run the app.
if __name__ == '__main__':
    app.run(debug=True)
