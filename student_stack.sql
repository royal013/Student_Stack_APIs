CREATE TABLE `user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `user_name` VARCHAR(200) NOT NULL UNIQUE,
    `password` VARCHAR(200) NOT NULL,
    `topics` VARCHAR(200) NOT NULL,
    `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `current_date` DATE DEFAULT CURRENT_DATE
);

CREATE TABLE post (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    description TEXT NOT NULL,
    photo VARCHAR(500) NOT NULL,
    feeling VARCHAR(300) NOT NULL,
    location VARCHAR(400) NOT NULL,
    tagged_friends VARCHAR(500) DEFAULT NULL
);
