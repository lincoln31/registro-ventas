losCREATE DATABASE IF NOT EXISTS registro_ventas;
USE registro_ventas;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid INT NOT NULL,
    producto VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    precioUnit DECIMAL(10,2) NOT NULL,
    importe DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'USD',
    fecha DATE NOT NULL,
    fechaISO VARCHAR(10) NOT NULL,
    mes VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_uid_fecha (uid, fechaISO),
    INDEX idx_uid_mes (uid, mes),
    INDEX idx_uid_moneda (uid, moneda)
);
