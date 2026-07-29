# Contribute

## Something is missing for your usage ?

You can contribute easily to the project by adding a new folder in the `override` folder.

To do so :

```bash
git clone git@github.com:DavidBabel/antigravity-icons-supercharged.git

bun install
# Then start contribute by running :
bun run contrib
```

It will look like that :

<img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/contrib.gif" alt="contrib" width="640">

It will open the new generated json file in the `override` folder.
Depending on your choices, juste take a look at the other override files to understand how it works.
It is dead simple.

## Colors

Try to respect the default colors of the theme. If you use SVG, ask Gemini to switch the colors for you.

### Base Colors

- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/gray-theme.png" alt="gray-theme" width="12"> Gray (theme) : #64748B
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/blue-theme.png" alt="blue-theme" width="12"> Blue (theme) : #42a5f5

### Other Colors

- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/purple.png" alt="purple" width="12"> Purple : #C084FC
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/darkpurple.png" alt="darkpurple" width="12"> DarkPurple : #8B5CF6
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/lightblue.png" alt="lightblue" width="12"> LightBlue : #60A5FA
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/blue.png" alt="blue" width="12"> Blue : #0EA5E9
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/darkblue.png" alt="darkblue" width="12"> DarkBlue : #2563EB
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/green.png" alt="green" width="12"> Green : #16A34A
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/yellow.png" alt="yellow" width="12"> Yellow : #FBBF24
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/orange.png" alt="orange" width="12"> Orange : #F59E0B
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/darkorange.png" alt="darkorange" width="12"> DarkOrange : #EA580C
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/red.png" alt="red" width="12"> Red : #F87171
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/pink.png" alt="pink" width="12"> Pink : #F472B6
- <img src="https://raw.githubusercontent.com/DavidBabel/antigravity-icons-supercharged/main/images/colors/lightgray.png" alt="lightgray" width="12"> LightGray : #71717A

## Build

The command `bun run build` will generate the `build-<color>/symbol-icon-theme.json` file.
This file is a concatenation of :

- all the icon files in the submodule `vscode-symbols/src/icons` folder.
- then it merges all the content of the plugins added in the subfolders of the `override` folder.

## Test

```bash
bun run lint
bun run build
# to install your vsix
bun run package
```

Then right click your vsix from `build/antigravity-icons-supercharged-xxx.vsix`

And click at the bottom "Install the VSIX of the extension".
