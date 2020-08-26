from flask import Flask, render_template, request, jsonify, url_for
import requests
from lxml import html
from packing import packing_list

app = Flask(__name__)


@app.route("/")
def hello_world():
    return render_template("index.html")


@app.route("/get_info", methods=["POST"])
def get_info():
    code = request.form['code']
    code = code.upper()
    batch = request.form['batch']

    cookie = dict(
        Cookie="özel-cookie")

    page = requests.get("http://scharlab.com/coa-form.php?r=" + code + "&b=" + batch + "&u=&c=kullanici", headers=cookie)

    page_html = html.fromstring(page.content)

    coa_sample_link = page_html.xpath('//*[@id="content"]/div/div[2]/section/div[4]/div[2]/a/@href')

    if not batch == '':
        coa_link = page_html.xpath('//*[@id="content"]/div/div[2]/section/div[6]/div/div[2]/div/a/@href')
    else:
        coa_link = ["None"]

    index = 0

    last_code = code

    while len(coa_sample_link) == 0:
        try:
            code += packing_list[index]
            code = code.upper()
            page = requests.get("http://scharlab.com/coa-form.php?r=" + code + "&b=" + batch + "&u=&c=kullanici",
                                headers=cookie)
            page_html = html.fromstring(page.content)
            coa_sample_link = page_html.xpath('//*[@id="content"]/div/div[2]/section/div[4]/div[2]/a/@href')
            if packing_list[index] in code:
                code = code.replace(packing_list[index], "")
            index += 1
        except IndexError:
            break

    while len(coa_link) == 0:
        try:
            code += packing_list[index]
            last_code = code
            code = code.upper()
            page = requests.get("http://scharlab.com/coa-form.php?r=" + code + "&b=" + batch + "&u=&c=kullanici",
                                headers=cookie)
            page_html = html.fromstring(page.content)
            coa_link = page_html.xpath('//*[@id="content"]/div/div[2]/section/div[6]/div/div[2]/div/a/@href')
            if packing_list[index] in code:
                code = code.replace(packing_list[index], "")
            index += 1
        except IndexError:
            break

    download_sample_link = "http://scharlab.com/" + coa_sample_link[0]
    download_link = "http://scharlab.com/" + coa_link[0]

    hata = "Sertifika bulunamadı. Ürün kodunu doğru yazdığınızdan emin olun."

    tds_link = code[:6] + "_TDS_EN.pdf"
    msds_link = code[:6] + "_EN.pdf"

    coa_filename = coa_link[0].split("=")[-1]
    coa_sample_filename = coa_sample_link[0].split("=")[-1]

    return jsonify(code=code, last_code=last_code, batch=batch, dl_sample_link=download_sample_link, dl_link=download_link,
                   tds=url_for("static", filename="tds/" + tds_link),
                   msds=url_for("static", filename="msds/" + msds_link), error=hata, coa_s_fn=coa_sample_filename,
                   coa_fn=coa_filename, tds_fn=tds_link, msds_fn=msds_link)


if __name__ == '__main__':
    app.run()
