from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re

app = Flask(__name__)

CORS(app)

def extract_entries():
    url = 'https://news.ycombinator.com/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    entries = []
    items = soup.find_all('tr', class_='athing') 

    for item in items[:30]:
        entry_number = item.find('span', class_='rank')
        entry_number = entry_number.text.strip() if entry_number else '0'

        title_tag = item.find('span', class_='titleline').find('a')
        title = title_tag.text.strip() if title_tag else ''

        subtext = item.find_next_sibling('tr').find('td', class_='subtext')

        points = subtext.find('span', class_='score').text.split()[0] if subtext and subtext.find('span', class_='score') else '0'

        comments_link = subtext.find_all('a')[-1] if subtext else None
        comments = comments_link.text.split()[0] if comments_link and 'comment' in comments_link.text else '0'

        entries.append({
            'number': int(entry_number[:-1]),
            'title': title,
            'points': int(points),
            'comments': int(comments)
        })

    return entries

def filter_by_comments(entries):
    # Filtrar entradas con más de 5 palabras en el título y ordenarlas por comentarios
    return sorted(
        [entry for entry in entries if len(re.findall(r'\b\w+\b', entry['title'])) > 5],
        key=lambda x: x['comments'],
        reverse=True
    )

def filter_by_points(entries):
    # Filtrar entradas con 5 o menos palabras en el título y ordenarlas por puntos
    return sorted(
        [entry for entry in entries if len(re.findall(r'\b\w+\b', entry['title'])) <= 5],
        key=lambda x: x['points'],
        reverse=True
    )

@app.route('/api/entries', methods=['GET'])
def get_entries():
    entries = extract_entries()
    return jsonify(entries)

@app.route('/api/entries/filter/comments', methods=['GET'])
def get_entries_by_comments():
    entries = extract_entries()
    filtered = filter_by_comments(entries)
    return jsonify(filtered)

@app.route('/api/entries/filter/points', methods=['GET'])
def get_entries_by_points():
    entries = extract_entries()
    filtered = filter_by_points(entries)
    return jsonify(filtered)

if __name__ == '__main__':
    app.run(debug=True)
