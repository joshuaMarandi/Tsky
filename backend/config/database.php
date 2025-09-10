<?php
// Auto-detect environment and configure database accordingly
$server_name = $_SERVER['SERVER_NAME'] ?? 'localhost';
$http_host = $_SERVER['HTTP_HOST'] ?? 'localhost';

// Check if we're on localhost (development) or hosted (production)
$is_localhost = (
    strpos($server_name, 'localhost') !== false ||
    strpos($http_host, 'localhost') !== false ||
    strpos($server_name, '127.0.0.1') !== false ||
    strpos($http_host, '127.0.0.1') !== false ||
    $server_name === '::1'
);

if ($is_localhost) {
    // Local development database
    class Database {
        private $host = "localhost";
        private $db_name = "Tsky";
        private $username = "root";
        private $password = "";
        public $conn;

        public function getConnection() {
            $this->conn = null;

            try {
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
                $this->conn->exec("set names utf8");
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch(PDOException $exception) {
                echo "Connection error: " . $exception->getMessage();
            }

            return $this->conn;
        }

        public function createDatabase() {
            try {
                // Connect without specifying database
                $tempConn = new PDO("mysql:host=" . $this->host, $this->username, $this->password);
                $tempConn->exec("set names utf8");
                $tempConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                // Create database if it doesn't exist
                $sql = "CREATE DATABASE IF NOT EXISTS " . $this->db_name . " CHARACTER SET utf8 COLLATE utf8_general_ci";
                $tempConn->exec($sql);

                return true;
            } catch(PDOException $exception) {
                echo "Database creation error: " . $exception->getMessage();
                return false;
            }
        }
    }
} else {
    // Production/Hosted database (InfinityFree)
    class Database {
        private $host = "sql313.infinityfree.com";
        private $db_name = "if0_39779787_tsky";
        private $username = "if0_39779787";
        private $password = "TvNOFPsbii43km";
        public $conn;

        public function getConnection() {
            $this->conn = null;

            try {
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
                $this->conn->exec("set names utf8");
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch(PDOException $exception) {
                echo "Connection error: " . $exception->getMessage();
            }

            return $this->conn;
        }

        public function createDatabase() {
            try {
                // Connect without specifying database
                $tempConn = new PDO("mysql:host=" . $this->host, $this->username, $this->password);
                $tempConn->exec("set names utf8");
                $tempConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                // Create database if it doesn't exist
                $sql = "CREATE DATABASE IF NOT EXISTS " . $this->db_name . " CHARACTER SET utf8 COLLATE utf8_general_ci";
                $tempConn->exec($sql);

                return true;
            } catch(PDOException $exception) {
                echo "Database creation error: " . $exception->getMessage();
                return false;
            }
        }
    }
}
?>
