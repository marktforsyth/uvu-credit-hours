# UVU Credit Hours

This is a simple tool to sort UVU courses by credit hour! For each credit hour, you can also choose whether you want only classes without prerequisites. If needed, many more features can be added.

Dependencies: `requests`, `beautifulsoup4`
(I chose to install these using `pip` inside of a `venv`)

To run:

```
cd creator
python main.py
```

The data is then dropped into `uvu-credit-hours-tool/data`. To generate the static website from the ReactJS Typescript code, run the following commands:

```
cd uvu-credit-hours-tool
yarn build
```

Then, simply deploy the contents of the `uvu-credit-hours-tool/dist` folder! Good luck :)
