### Requirements

This project requires Node

---

### Setup

The project can be setup using a `Make command` or running the yarn command directly.

Run make command

```bash
make setup
```

Run yarn commands

```bash
yarn install
yarn build
npm link
```

---

### Command Line Interface (CLI)

Once setup is complete a new cli command will be available called `convert`.

Example without including file path

```bash
Usage: convert -f test_file.gcode

Options:
      --version  Show version number                [boolean]
  -f, --file     path to file                       [string] [required]

Missing required argument: file
```

Example command use

```
convert --file test_file.gcode
```

This will create a file called `converted_file.txt` in the current directory.

Example without including file path

```bash
Usage: convert -f test_file.gcode

Options:
      --version  Show version number                [boolean]
  -f, --file     path to file                       [string] [required]

Missing required argument: file
```
