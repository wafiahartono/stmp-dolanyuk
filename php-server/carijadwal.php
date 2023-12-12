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
        $cari = "%{$_POST['cari']}%";
        $sql = "SELECT * FROM jadwal where informasi_dolanan like ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s",$cari);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        if($result->num_rows > 0)
        {
            while($r = mysqli_fetch_assoc($result))
            {
                array_push($data,$r);
            }
            $arr = ["result"=>"success","data"=>$data];
        }
        else
        {
            $arr = ["result"=>"error","message"=>"no data found"];
        }
        echo json_encode($arr);
    }
    $stmt->close();
    $conn->close();
?>
