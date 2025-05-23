from flask import Flask, render_template_string
app = Flask(__name__)

@app.route('/')
def index():
    with open('app_peliculas_con_lista_oculta.html', 'r') as file:
        template = file.read()
    return render_template_string(template)

if __name__ == '__main__':
    app.run(debug=True)