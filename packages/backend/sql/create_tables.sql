CREATE TABLE message_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-incrementing primary key
    timeStamp BIGINT,                   -- Unix time is a large integer
    message JSON,                       -- Storing JSON object
    source VARCHAR(255),                -- String, adjust size as needed
    sessionId VARCHAR(255),             -- String, adjust size as needed
    exchangeId VARCHAR(255)             -- String, adjust size as needed
);

-- This is how it looks like in the DB
-- +------------+--------------+------+-----+---------+----------------+
-- | Field      | Type         | Null | Key | Default | Extra          |
-- +------------+--------------+------+-----+---------+----------------+
-- | id         | int          | NO   | PRI | NULL    | auto_increment |
-- | timeStamp  | bigint       | YES  |     | NULL    |                |
-- | message    | json         | YES  |     | NULL    |                |
-- | source     | varchar(255) | YES  |     | NULL    |                |
-- | sessionId  | varchar(255) | YES  |     | NULL    |                |
-- | exchangeId | varchar(255) | YES  |     | NULL    |                |
-- +------------+--------------+------+-----+---------+----------------+