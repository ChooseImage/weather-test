# Moments - MTA Weather

Display realtime weather info through calling tomorrow.io API locally from the boards. 

* `single` board: realtime + forecast data
* `left` board: realtime data
* `center` board: forecast data
* `right` board: realtime + forecast data

## Folder Structure

* Four boards - single, left, center, and right
* **`/liveboard_files`** - `preview` image and `template.json` for each board
* **`/src`** - code files and assets
    * **`./index.html`** - dashbord page for development
    * **`./js`** - global shared helpers and functions
    * **`./styles`** - global shared styles
    * **`./pages`** - code and assets of individual boards
        * **`./assets`** - assets(fonts, images, videos, etc.) for all boards
        * **`./single`**, **`./left`**, **`./center`**, **`./right`** - individual boards code
* Refresh intervals are defined in `./src/js/constants.js`

## Development

### 1. Install packages
  ```
  yarn
  ``` 

### 2. Start local server
  ```
  yarn start
  ```
  
  Default address is at `localhost:1234`
  

### 3. Build for liveboards
  * Build for all boards
  
      ```
      yarn build:all
      ```
  
  * Zip all layouts
     
     ```
     yarn zip:all
     ```
     