<?php
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
?>
