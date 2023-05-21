import pandas as pd
import mysql.connector

#import journey csv files and combine them into a single dataframe
df1 = pd.read_csv("2021-05.csv",delimiter=",")
df2 = pd.read_csv("2021-06.csv",delimiter=",")
df3 = pd.read_csv("2021-07.csv",delimiter=",")
data= pd.concat([df1,df2,df3])
print(len(data))
#validate data, remove short distances and durations
data = data[(data["Covered distance (m)"] >= 10.0) & (data["Duration (sec.)"] >= 10) & (data["Departure station id"] >=0) & (data["Return station id"] >=0)]

#only keep used columns
data = data[['Departure station id', 'Departure station name','Return station id','Return station name','Covered distance (m)','Duration (sec.)']]
print(len(data))
data = data.drop_duplicates()

print(len(data))

 #import stations csv file
stations = pd.read_csv("stations.csv",delimiter=",")

#delete unused columns
stations.drop(["FID",'Namn','Name','Adress','Kaupunki','Stad','Operaattor','Kapasiteet'],inplace=True,axis=1)


 # Establish a connection to the MySQL database
cnx = mysql.connector.connect(
    host="",
    user="",
    password="",
    database="citybike"
)


cursor = cnx.cursor()
cnx.autocommit = False
# Prepare the SQL statement with parameter placeholders
query = "INSERT INTO journeys (departure_id, departure_name, return_id, return_name, distance, duration) VALUES (%s, %s, %s, %s, %s, %s)"

# Define the values list
values = data.values.tolist()
print(values[:10])

# Insert data into the journeys table using chunked insertion
chunk_size = 1000  # Number of rows per chunk
num_chunks = len(values) // chunk_size

for i in range(num_chunks):
    chunk = values[i * chunk_size : (i + 1) * chunk_size]
    cursor.executemany(query, chunk)
    cnx.commit()
    print(f"Iterated through {chunk_size * (i + 1)} rows")

# Insert the remaining rows (if any)
remaining_rows = values[num_chunks * chunk_size:]
cursor.executemany(query, remaining_rows)
cnx.commit()
print(f"Iterated through {len(values)} rows")
    
""" for _, row in stations.iterrows():
     query = "INSERT INTO stations (id, name, address, x, y) VALUES (%s, %s,%s,%s,%s)"
     values = (row["ID"], row["Nimi"],row["Osoite"], row["x"], row["y"])
     cursor.execute(query, values) 


 """


cnx.commit()
cursor.close()
cnx.close()  