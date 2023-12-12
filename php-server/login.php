<?php
    header("Access-Control-Allow-Origin: *");
    $arr = null;
    $conn = new mysqli("localhost","react_160419098","ubaya","react_160419098");
    if($conn->connect_error)
    {
        $arr = ["result"=>"error","message"=>"unable to connect to database"];
    }
    else
    {
        extract($_POST);
        $sql = "SELECT * FROM user WHERE email=? AND password=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss",$email,$password);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0)
        {
            $r = mysqli_fetch_assoc($result);
            $arr = ["result"=>"success","nama_lengkap"=>$r['nama_lengkap']];
        }
        else
        {
            $arr = ["result"=>"error","message"=>"sql error: $sql"];
        }
        echo json_encode($arr);
    }
    $stmt->close();
    $conn->close();
?>
