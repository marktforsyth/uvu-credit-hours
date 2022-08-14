# UVU Credit Hours

This is a simple tool to sort UVU courses by credit hour! For each credit hour, you can also choose whether you want only classes without prerequisites. If needed, many more features can be added.

Dependencies: `requests`, `beautifulsoup4`
(I chose to install these using `pip` inside of a `venv`)

To run:

```
cd creator
python main.py
```

(EDIT: I'm currently updating this to a ReactJS project (which will also have static output generated), where the python file will output JSON used in the project. I'll update the documentation more as things progress :D)

~~The updated files are stored in the `output` folder, in the form of HTML and CSS. The website is completely static (there's not even any JavaScript, as of right now), and can be deployed anywhere with no configuration required.~~
