<?php
header('Content-Type: application/json');

	class connector{
		public $host = "localhost";					
		public $dbname = "2hrisdbic";			
		public $name = "root";						
		public $pass = "";
		function connect(){
			$conn = mysqli_connect("$this->host", "$this->name", "$this->pass","$this->dbname");
			if (!$conn)
			{
				die('Could not connect: ' . mysqli_connect_error());
			}
			$conn->set_charset("utf8");
			return $conn;
		}
		
		/*function connect2(){
			$conn = mysqli_connect("localhost", "root", "delsan@1991","2hrisdbic");
			if (!$conn)
			{
				die('Could not connect: ' . mysqli_connect_error());
			}
			$conn->set_charset("utf8");
			return $conn;
		}*/
	}

?>