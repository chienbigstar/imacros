ls -D /root/".moonchild productions"/"pale moon"
echo enter first
read f
echo enter last
read l

for i in `seq $f $l`;
do
palemoon -p $i -no-remote imacros://run/?m="video$i.js" &
done