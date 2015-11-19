# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, make_response, send_file
import urllib, io
import HTMLParser

app = Flask(__name__)

@app.route('/')
def index():
    return "hi"

@app.route('/serve')
def serve():
    h = HTMLParser.HTMLParser()
    image_url = h.unescape(request.args.get('url'))
    return send_file(io.BytesIO(urllib.urlopen(image_url).read()), attachment_filename="prof.jpg", mimetype="image/jpeg")

# Run the app.
if __name__ == '__main__':
    app.run(debug=True)


