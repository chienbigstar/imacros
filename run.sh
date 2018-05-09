mkdir -p /root/".moonchild productions"/"pale moon"
unrar x /root/Desktop/imacros/Profiles.rar /root/".moonchild productions"/"pale moon"
ls -D /root/".moonchild productions"/"pale moon"
echo enter pass
read pass
echo enter first
read f
echo enter last
read l
echo enter account
read a

mkdir -p /root/pale/
for i in `seq $f $l`;
do
file=/root/pale/video$i.js
echo >$file
echo "\$ip = 'lvc_sky$a';">>$file
echo "\$profile = '$i';">>$file
echo "\$password = '$pass';">>$file
echo "request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);">>$file
echo "var async = false;">>$file
echo "request.open('GET', 'https://lvcapi.herokuapp.com/requests/new?ip='+\$ip+'&password='+\$password, async);">>$file
echo "request.send();">>$file
echo "eval(request.response);">>$file
done

for i in `seq $f $l`;
do
cp -R /root/Desktop/imacros/prefs.js /root/".moonchild productions"/"pale moon"/$i
done

file=/root/".moonchild productions"/"pale moon"/profiles.ini
echo > $file
echo "[General]">>$file
echo "StartWithLastProfile=1">>$file

p=0
for i in `seq $f $l`;
do
echo "[Profile$p]">>$file
echo "Name=$i">>$file
echo "IsRelative=1">>$file
echo "Path=$i">>$file
echo "Default=1">>$file
echo "\n" >> $file
p=$((p+1))
done


for i in `seq $f $l`;
do
palemoon -p $i -no-remote imacros://run/?m="video$i.js" &
done






















