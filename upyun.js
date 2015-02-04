var bucketName   = 'staticfile00';
var operatorName = 'xiatianhan';
var operatorPwd  = 'operatorpassword';

//被上传的文件路径
$filePath = 'assets/bar.txt';
$fileSize = filesize($filePath);
//文件上传到服务器的服务端路径
$serverPath = 'foo.txt';
$uri = "/$bucketName/$serverPath";


//生成签名时间。得到的日期格式如：Thu, 11 Jul 2014 05:34:12 GMT
$date = gmdate('D, d M Y H:i:s \G\M\T');
$sign = md5("PUT&{$uri}&{$date}&{$fileSize}&".md5($operatorPwd));

$ch = curl_init('http://v0.api.upyun.com' . $uri);

$headers = array(
    "Expect:",
    "Date: ".$date, // header 中需要使用生成签名的时间
    "Authorization: UpYun $operatorName:".$sign
);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_PUT, true);

$fh = fopen($filePath, 'rb');
curl_setopt($ch, CURLOPT_INFILE, $fh);
curl_setopt($ch, CURLOPT_INFILESIZE, $fileSize);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$result = curl_exec($ch);
if(curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200) {
    //"上传成功"

} else {
    $errorMessage = sprintf("UPYUN API ERROR:%s", $result);
    echo $errorMessage;
}
curl_close($ch);
