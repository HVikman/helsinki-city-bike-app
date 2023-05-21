# Helsinki City Bike App

This repository contains pre-assignment for Solita Dev Academy Finland 2023.
API documentation is available at https://hvikman.github.io/helsinki-city-bike-app

## Table of Contents

- [Features](#features)
  - [Data import](#data-import)
  - [Journey list view](#journey-list-view)
  - [Station list](#station-list)
  - [Single station view](#single-station-view)
- [Installation](#installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Importing data](#importing-data)

## Features

### Data import

- [x] Import data from the CSV files to a database or in-memory storage
- [x] Validate data before importing
- [x] Don't import journeys that lasted for less than ten seconds
- [x] Don't import journeys that covered distances shorter than 10 meters

### Journey list view

- [x] List journeys
- [x] For each journey show departure and return stations, covered distance in kilometers and duration in minutes
- [x] Pagination
- [ ] Ordering per column
- [ ] Searching
- [ ] Filtering

### Station list

- [x] List all the stations
- [x] Pagination
- [ ] Searching

### Single station view

- [x] Station name
- [x] Station address
- [x] Total number of journeys starting from the station
- [x] Total number of journeys ending at the station
- [x] Station location on the map
- [x] The average distance of a journey starting from the station
- [x] The average distance of a journey ending at the station
- [x] Top 5 most popular return stations for journeys starting from the station
- [x] Top 5 most popular departure stations for journeys ending at the station
- [ ] Ability to filter all the calculations per month

## Installation

### Backend

1. Clone the repository:

   ```bash
   git clone https://github.com/HVikman/helsinki-city-bike-app.git

   ```

2. Navigate to the backend directory:

   ```bash
   cd helsinki-city-bike-app/backend

   ```

3. Install the required dependencies using npm:

   ```bash
   npm install

   ```

4. Set up environment variables:

   - Create a .env file in the root of the backend directory.
   - Specify the required environment variables in the .env file. Refer to .env.example for the list of variables.

5. Create a MySQL database for the backend:

   - Make sure you have a MySQL database server installed and running.

   - Open a terminal or command prompt.

- Log in to the MySQL server using the command:
  ```bash
  mysql -u your_username -p
  ```
- Create a new database
  ```mysql
  CREATE DATABASE your_database_name;
  ```
- Exit mysql
  ```mysql
  EXIT;
  ```

6. Import database

   ```bash
   mysql -u your_username -p your_database_name < create_db.sql
   ```

7. Start backend
   ```
   npm start
   ```
   Backend will be running at http://localhost:4000 unless different port is specified in .env file.

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd helsinki-city-bike-app/frontend

   ```

2. Install the required dependencies using npm:

   ```bash
   npm install

   ```

3. Edit apiurl constant in /pages/JourneyList.js and /pages/StationList.js to your backend url.

4. Build the frontend:

   ```bash
   npm run build
   ```

   Bundled files will be in build directory

### Importing data

1. Download three datasets of journey data. The data is owned by City Bike Finland.

- <https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv>
- <https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv>
- <https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv>

2. Download dataset that has information about Helsinki Region Transport’s (HSL) city bicycle stations.

- Dataset: <https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv>
- License and information: <https://www.avoindata.fi/data/en/dataset/hsl-n-kaupunkipyoraasemat/resource/a23eef3a-cc40-4608-8aa2-c730d17e8902>

3. Ensure you have Python 3 installed on your system.

4. Install the required Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Modify the script to have your database information and uncomment lines containing database insertion.

6. Run the script:

   ```bash
   python data_importer.py
   ```

   The script will import the data into the Helsinki City Bike App's database.
