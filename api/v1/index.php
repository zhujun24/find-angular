<?php

date_default_timezone_set("Asia/Shanghai");
header("Content-Type: text/html;charset=utf-8");
session_cache_limiter(false);
session_start();
require '../Slim/Slim.php';

$app = new Slim();

$app->get('/', 'hello');

//用户模块
$app->post('/user/login', 'login'); //登陆
$app->post('/user/logout', 'logout'); //登出
$app->post('/user/reg', 'reg'); //注册
$app->put('/user/:uid/modify', 'modify'); //修改用户信息
$app->post('/user/repeat', 'repeat'); //用户名查重

//首页表格信息
$app->get('/index', 'index');

//根据pid获取信息
$app->get('/p/:pid', 'getP');

//发布评论
$app->post('/p/comment', 'commentPub');

//发布信息
$app->post('/p', 'pPub');

//发布信息
$app->post('/photo', 'photo');

//删除评论
$app->delete('/p/:cid/comment/delete', 'deleteComment');

//根据uid获取个人中心信息
$app->get('/user/:uid/zone', 'getZone');

//成功事例
$app->put('/p/:pid/succeed', 'succeed');

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
    echo "Hello World!!!";
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
    unset($_SESSION['uid']);
    session_destroy();
    $result = '{"meta": {"code": 201, "message": "登出成功"},"data": ""}';
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

function reg()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    $sqlname = "SELECT uname FROM t_user WHERE uname='" . $json->name . "'";
    $sqlemail = "SELECT uemail FROM t_user WHERE uemail='" . $json->email . "'";
    $db = getConnection();
    $stmtname = $db->query($sqlname);
    $stmtemail = $db->query($sqlemail);
    $resultname = $stmtname->fetchAll(PDO::FETCH_OBJ);
    $resultemail = $stmtemail->fetchAll(PDO::FETCH_OBJ);

    if (empty($resultname)) {
        if (empty($resultemail)) {
            //昵称、邮箱没有重复，可以注册
            $sql = "INSERT INTO t_user (uname, uemail, upwd, utel, uqq) VALUES (:uname, :uemail, :upwd, :utel, :uqq)";

            $stmt = $db->prepare($sql);
            $password = md5($json->password);
            $stmt->bindParam("uname", $json->name);
            $stmt->bindParam("uemail", $json->email);
            $stmt->bindParam("upwd", $password);
            $stmt->bindParam("utel", $json->tel);
            $stmt->bindParam("uqq", $json->qq);
            $stmt->execute();
            $db = null;
            $result = '{"meta": {"code": 201, "message": "注册成功"},"data": ""}';
            echo $result;
        } else {
            //邮箱存在
            $result = '{"meta": {"code": 202, "message": "邮箱存在"},"data": ""}';
            echo $result;
        }
    } else {
        //昵称存在
        $result = '{"meta": {"code": 203, "message": "昵称存在"},"data": ""}';
        echo $result;
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
    $sql1 = "SELECT uname,uheader,ctime,cdetails FROM t_comment,t_user WHERE t_comment.pid=$pid AND t_user.uid=t_comment.uid ORDER BY cid DESC";
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

function commentPub()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['uid']) && ($_SESSION['uid'] == $json->uid)) {
        //用户已登陆
        $sql = "INSERT INTO t_comment (pid, uid, cdetails) VALUES (:pid, :uid, :cdetails)";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("pid", $json->pid);
        $stmt->bindParam("uid", $json->uid);
        $stmt->bindParam("cdetails", $json->cdetails);
        $stmt->execute();
        $json->cid = $db->lastInsertId();
        $db = null;

        $result = array("publishDate" => date("Y-m-d H:i:s"));
        $result = '{"meta": {"code": 201, "message": "评论成功"},"data": ' . json_encode($result) . '}';
        echo $result;
    } else {
        //用户未登陆
        $result = '{"meta": {"code": 202, "message": "用户未登陆"},"data": ""}';
        echo $result;
    }
}

function getZone($uid)
{
    if (isset($_SESSION['uid'])) {
        //用户已登陆
        $uid = ($_SESSION['uid']);
        $sql0 = "SELECT pid,ptime,pdetails,pimage,psucceed FROM t_publish WHERE uid=$uid AND t_publish.ptype=0 ORDER BY pid DESC";
        $sql1 = "SELECT pid,ptime,pdetails,pimage,psucceed FROM t_publish WHERE uid=$uid AND t_publish.ptype=1 ORDER BY pid DESC";
        $sql2 = "SELECT pid,cid,ctime,cdetails FROM t_comment WHERE uid=$uid ORDER BY cid DESC";
        $db = getConnection();
        $stmt0 = $db->query($sql0);
        $result0 = $stmt0->fetchAll(PDO::FETCH_OBJ);
        $stmt1 = $db->query($sql1);
        $result1 = $stmt1->fetchAll(PDO::FETCH_OBJ);
        $stmt2 = $db->query($sql2);
        $result2 = $stmt2->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        $result = array("lost" => $result0, "find" => $result1, "comment" => $result2);
        $result = '{"meta": {"code": 201, "message": "个人中心信息获取成功"},"data": ' . json_encode($result) . '}';
        echo $result;
    } else {
        //用户未登陆
        $result = '{"meta": {"code": 202, "message": "用户未登陆"},"data": ""}';
        echo $result;
    }
}

function succeed($pid)
{
    if (isset($_SESSION['uid'])) {
        //用户已登陆
        $uid = $_SESSION['uid'];

        $sql0 = "SELECT uid FROM t_publish WHERE pid=$pid";

        $db = getConnection();
        $stmt0 = $db->query($sql0);
        $result0 = $stmt0->fetch(PDO::FETCH_OBJ);
        $result0 = $result0->uid;

        if ($uid == $result0) {
            $sql1 = "UPDATE t_publish SET psucceed=1 WHERE pid=$pid";
            $stmt1 = $db->prepare($sql1);
            $stmt1->execute();
            $db = null;

            $result = '{"meta": {"code": 201, "message": "成功"},"data": ""}';
            echo $result;
        } else {
            $result = '{"meta": {"code": 202, "message": "不是你发布的，改毛啊"},"data": ""}';
            echo $result;
        }

    } else {
        //用户未登陆
        $result = '{"meta": {"code": 203, "message": "用户未登陆，改毛啊"},"data": ""}';
        echo $result;
    }
}

function deleteComment($cid)
{
    if (isset($_SESSION['uid'])) {
        //用户已登陆
        $uid = $_SESSION['uid'];

        $sql0 = "SELECT uid FROM t_comment WHERE cid=$cid";

        $db = getConnection();
        $stmt0 = $db->query($sql0);
        $result0 = $stmt0->fetch(PDO::FETCH_OBJ);
        $result0 = $result0->uid;

        if ($uid == $result0) {
            $sql1 = "DELETE FROM t_comment WHERE cid=$cid";
            $stmt1 = $db->prepare($sql1);
            $stmt1->execute();
            $db = null;

            $result = '{"meta": {"code": 201, "message": "成功"},"data": ""}';
            echo $result;
        } else {
            $result = '{"meta": {"code": 202, "message": "不是你的，删个毛啊"},"data": ""}';
            echo $result;
        }

    } else {
        //用户未登陆
        $result = '{"meta": {"code": 203, "message": "用户未登陆"},"data": ""}';
        echo $result;
    }
}

function modify($uid)
{
    if (isset($_SESSION['uid'])) {
        //用户已登陆
        $request = Slim::getInstance()->request();
        $body = $request->getBody();
        $json = json_decode($body);

        $sql = "UPDATE t_user SET uname=:uname, utel=:utel, uqq=:uqq WHERE uid=$uid";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("uname", $json->uname);
        $stmt->bindParam("utel", $json->utel);
        $stmt->bindParam("uqq", $json->uqq);
        $stmt->execute();
        $db = null;
        $result = '{"meta": {"code": 201, "message": "修改成功"},"data": ""}';
        echo $result;
    } else {
        //用户未登陆
        $result = '{"meta": {"code": 202, "message": "用户未登陆"},"data": ""}';
        echo $result;
    }
}

function pPub()
{
    if (isset($_SESSION['uid'])) {
        //用户已登陆
        $uid = $_SESSION['uid'];
        $request = Slim::getInstance()->request();
        $json = $request->getBody();
        $json = json_decode($json);

        $sql0 = "INSERT INTO t_publish (uid, pitem, pname, plocation, pdate, pdetails, ptype) VALUES ($uid, :pitem, :pname, :plocation, :pdate, :pdetails, :ptype)";
        $db = getConnection();
        $stmt = $db->prepare($sql0);
        $stmt->bindParam("pitem", $json->pitem);
        $stmt->bindParam("pname", $json->pname);
        $stmt->bindParam("plocation", $json->plocation);
        $stmt->bindParam("pdate", $json->pdate);
        $stmt->bindParam("pdetails", $json->pdetails);
        $stmt->bindParam("ptype", $json->ptype);
        $stmt->execute();

        $pid = $db->lastInsertId();

        if ($json->photoType) {
            $photoType = $json->photoType;
            $tempPath = '../../upload/temp/' . isset($_SESSION['uid']) . '.' . $photoType;
            $uploadPath = '../../upload/lostfind/' . $pid . '.' . $photoType;
            rename($tempPath, $uploadPath);

            $sqlUrl = '/upload/lostfind/' . $pid . '.' . $photoType;
            $sql = "UPDATE t_publish SET pimage=:pimage WHERE pid=:pid";
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("pimage", $sqlUrl);
            $stmt->bindParam("pid", $pid);
            $stmt->execute();
        }

        $db = null;

        $result0 = array("pid" => $pid, "photoType" => $json->photoType);
        $result = '{"meta": {"code": 201, "message": "发布成功"},"data": ' . json_encode($result0) . '}';
        echo $result;
    } else {

        $result = '{"meta": {"code": 202, "message": "未登录"},"data": ""}';
        echo $result;
    }
}

function photo()
{
    if (isset($_SESSION['uid']) && !empty($_FILES)) {
        //用户已登陆
        $tempPath = $_FILES['file']['tmp_name'];
        $filename = $_FILES['file']['name'];
        $ext = substr(strrchr($filename, '.'), 1);
        $photoInfo = $_SESSION['uid'] . '.' . $ext;
        $uploadPath = '../../upload/temp/' . $photoInfo;

        move_uploaded_file($tempPath, $uploadPath);

        $result0 = array("type" => $ext);
        $result = '{"meta": {"code": 201, "message": "上传成功"},"data": ' . json_encode($result0) . '}';
        echo $result;
    } else {

        $result = '{"meta": {"code": 202, "message": "未登录"},"data": ""}';
        echo $result;
    }
}

?>