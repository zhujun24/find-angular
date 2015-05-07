<?php
/**
 * Created by PhpStorm.
 * User: zhujun
 * Date: 2015/5/7
 * Time: 19:39
 */

header("Content-Type: text/html;charset=utf-8");
session_cache_limiter(false);
session_start();
require 'Slim/Slim.php';

$app = new Slim();

$app->get('/', 'hello');
$app->post('/login', 'login'); //登陆
$app->post('/logout', 'logout'); //登出
$app->post('/register', 'register'); //注册
$app->post('/repeat', 'repeat'); //校外用户注册用户名查重

$app->run();

function getConnection()
{
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "shiyanshi";
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

    if (isset($json->usertype) && $json->usertype == 0) {
        $sql = "SELECT * FROM outside WHERE status='1' AND username='" . $json->username . "'LIMIT 1";
    } else if ($json->usertype == 1) {
        $sql = "SELECT * FROM user WHERE status='1' AND username='" . $json->username . "'LIMIT 1";
    } else if ($json->usertype == 2) {
        $sql = "SELECT * FROM shiyanyuan WHERE username='" . $json->username . "'LIMIT 1";
    } else if ($json->usertype == 3) {
        $sql = "SELECT * FROM admin WHERE username='" . $json->username . "'LIMIT 1";
    } else {
        //未知用户类型
        echo '{"data": "", "code": "001"' . '}';
        exit;
    }

    $db = getConnection();
    $stmt = $db->query($sql);
    $result = $stmt->fetch(PDO::FETCH_OBJ);
    $db = null;

    if (!empty($result)) {
        $password = md5($json->password);
        if ($result->password == $password) {
            $_SESSION['uid'] = $result->uid;
            $_SESSION['usertype'] = $result->usertype;
            unset($result->password);
            $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
            echo $result;
        } else {
            //密码错误
            echo '{"data": "", "code": "002"' . '}';
        }
    } else {
        //用户不存在
        echo '{"data": "", "code": "003"' . '}';
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

?>