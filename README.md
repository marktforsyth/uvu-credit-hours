# UVU Credit Hours

This is a simple tool to sort UVU courses by credit hour! For each credit hour, you can also choose whether you want only classes without prerequisites. If needed, many more features can be added.

Dependencies: `requests`, `beautifulsoup4`
(I chose to install these using `pip` inside of a `venv`)

To run:

```
cd creator
python main.py
```

The updated files are stored in the `output` folder, in the form of HTML and CSS. The website is completely static (there's not even any JavaScript, as of right now), and can be deployed anywhere with no configuration required.
