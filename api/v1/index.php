<?php

header("Content-Type: text/html;charset=utf-8");
session_cache_limiter(false);
session_start();
require '../Slim/Slim.php';

$app = new Slim();

$app->get('/', 'hello');

//用户模块
$app->post('/login', 'login'); //登陆
$app->post('/logout', 'logout'); //登出
$app->post('/register', 'register'); //注册
$app->post('/repeat', 'repeat'); //校外用户注册用户名查重

//首页表格信息
$app->get('/index', 'index');

//根据pid获取信息
$app->get('/p/:pid', 'getP');

$app->run();

function getConnection()
{
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "find-angular";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

function hello()
{
    echo 'Hello world!';
}

function login()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    $sql = "SELECT * FROM t_user WHERE uemail='" . $json->email . "'";
    $db = getConnection();
    $stmt = $db->query($sql);
    $result = $stmt->fetch(PDO::FETCH_OBJ);
    $db = null;

    if (!empty($result)) {
        $password = md5($json->password);
        if ($result->upwd == $password) {
            $_SESSION['uid'] = $result->uid;

            $result = array("uid" => $result->uid, "email" => $result->uemail, "name" => $result->uname, "tel" => $result->utel, "qq" => $result->uqq, "header" => $result->uheader);
            $result = '{"meta": {"code": 201, "message": "登录成功"},"data": ' . json_encode($result) . '}';
            echo $result;
        } else {
            //密码错误
            $result = '{"meta": {"code": 202, "message": "密码错误"},"data": ""}';
            echo $result;
        }
    } else {
        //用户不存在
        $result = '{"meta": {"code": 203, "message": "用户不存在"},"data": ""}';
        echo $result;
    }
}

function logout()
{
    unset($_SESSION['usertype']);
    unset($_SESSION['uid']);
    session_destroy();
    $result = '{"data": "", "code":"000"}';
    echo $result;
}

function repeat()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (!empty($json->username)) {
        $sql = "SELECT username FROM outside WHERE username='" . $json->username . "'";
        $db = getConnection();
        $stmt = $db->query($sql);
        $result = $stmt->fetch(PDO::FETCH_OBJ);
        $db = null;

        if (empty($result)) {
            echo '{"data": "", "code": "000"' . '}';
            //用户名没有重复，可以注册
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //用户名重复，拒绝注册
        }
    } else {
        echo '{"data": "", "code": "002"' . '}';
        //接受username为空
    }
}

function register()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);
    if (empty($json->username)) {
        echo '{"data": "", "code": "002"' . '}';
        //用户名为空，拒绝注册
        exit;
    } else {
        $sql = "SELECT username FROM outside WHERE username='" . $json->username . "'";
        $db = getConnection();
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    }

    if (empty($result)) {
        //用户名没有重复，可以注册
        $sql = "INSERT INTO outside (username, password, name, phone, unit, head, headphone) VALUES (:username, :password, :name, :phone, :unit, :head, :headphone)";

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $password = md5($json->password);
        $stmt->bindParam("username", $json->username);
        $stmt->bindParam("password", $password);
        $stmt->bindParam("name", $json->name);
        $stmt->bindParam("phone", $json->phone);
        $stmt->bindParam("unit", $json->unit);
        $stmt->bindParam("head", $json->head);
        $stmt->bindParam("headphone", $json->headphone);
        $stmt->execute();
        $json->uid = $db->lastInsertId();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //注册成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //用户名重复，拒绝注册
    }
}

function index()
{
    $sql0 = "SELECT pid,pdate,pdetails,pitem,pname,plocation,ptype FROM t_publish WHERE ptype=0 ORDER BY pid DESC limit 8";
    $sql1 = "SELECT pid,pdate,pdetails,pitem,pname,plocation,ptype FROM t_publish WHERE ptype=1 ORDER BY pid DESC limit 8";
    $sql2 = "SELECT * FROM t_publish WHERE psucceed=1";
    $db = getConnection();
    $stmt0 = $db->query($sql0);
    $result0 = $stmt0->fetchAll(PDO::FETCH_OBJ);
    $stmt1 = $db->query($sql1);
    $result1 = $stmt1->fetchAll(PDO::FETCH_OBJ);
    $stmt2 = $db->query($sql2);
    $result2 = $stmt2->fetchALl(PDO::FETCH_OBJ);
    $db = null;

    $result = array("lost" => $result0, "find" => $result1, "succeed" => count($result2), "year" => date("Y"));
    $result = '{"meta": {"code": 201, "message": "请求成功"},"data": ' . json_encode($result) . '}';
    echo $result;
}

function getP($pid)
{
    $sql0 = "SELECT uname,uheader,pid,ptime,pdetails,pimage FROM t_publish,t_user WHERE t_publish.pid=$pid AND t_user.uid=t_publish.uid";
    $sql1 = "SELECT uname,uheader,ctime,cdetails FROM t_comment,t_user WHERE t_comment.pid=$pid AND t_user.uid=t_comment.uid";
    $db = getConnection();
    $stmt0 = $db->query($sql0);
    $result0 = $stmt0->fetch(PDO::FETCH_OBJ);
    $stmt1 = $db->query($sql1);
    $result1 = $stmt1->fetchAll(PDO::FETCH_OBJ);
    $db = null;

    $result = array("publish" => $result0, "comment" => $result1);
    $result = '{"meta": {"code": 201, "message": "请求成功"},"data": ' . json_encode($result) . '}';
    echo $result;

}

?>