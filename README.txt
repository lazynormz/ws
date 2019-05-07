requirements:
    *   MariaDB 10.3
    *   Node v10.15.3

How to use:
    *   Run executable for your system from the root folder (server)
    |   OR
    *   open cmd/terminal in ./server and run following commands:
        -   npm i -y express mariadb js-sha256 body-parser
        |   [once done installing run the following:]
        -   node index.js
        
    *   Either of these will start a local server on port 8080. To acces the website, go to the following page: http://localhost:8080
        -   This website is only available on the local network. A port (8080) can be opened to allow incoming trafic from outsite the local network