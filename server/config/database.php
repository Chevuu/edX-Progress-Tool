<?php
class Database
{
    private $db_host = 'localhost';
    private $db_username = 'vukroot';
    private $db_password = 'Aeghe+i1';
    private $db_database = 'map';
    private $db_connection;

    function __construct()
    {
        date_default_timezone_set('Europe/Amsterdam');
        $this->db_connection = mysqli_connect($this->db_host, $this->db_username, $this->db_password, $this->db_database);
        if (mysqli_connect_errno()) {
            $this->__error(mysqli_connect_error(), __LINE__);
        }
    }

    public function prepare($query)
    {
        $stmt = $this->db_connection->prepare($query);
        if (!$stmt) {
            $this->__error("Prepare error: " . $this->db_connection->error);
        }
        return $stmt;
    }

    public function execute($stmt, $params)
    {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
        if (!$stmt->execute()) {
            $this->__error("Execute error: " . $stmt->error);
        }
        return $stmt;
    }

    public function fetch_assoc($stmt)
    {
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function insert_id()
    {
        return mysqli_insert_id($this->db_connection);
    }

    private function __error($error, $line = '')
    {
        echo "<h3>Database Error</h3><p>Error: $error</p><p>Line: $line</p>";
        exit;
    }
}
?>