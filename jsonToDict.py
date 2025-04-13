import json

with open('products.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

with open('data.txt', 'w') as output_file:
    for item in data:
        productNumber = item.get('productNumber')
        vol = item.get('volume')
        alc = item.get('alcoholPercentage')
        price = item.get('price')
        apk = round(vol * alc / price)

        
        output_file.write(f"'{productNumber}': {apk},\n")