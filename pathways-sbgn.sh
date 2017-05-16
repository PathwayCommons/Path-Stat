#!/bin/sh

##
# Gets each pathway by its URI from PC v9 and converts to SBGN PD
# (SBGN-ML XML) only if there are some interactions (excluding in sub-pathways).
##

PC2="http://beta.pathwaycommons.org/pc2"
echo "Using $PC2"
page=0
while [ $page -lt 63 ]
do
  echo "\nSEARCH PAGE $page"
  curl -sS "$PC2/search.json?q=*&type=pathway&page=$page" | jq -r '.searchHit[].uri' | while read uri ; do
    name=$(echo "$uri" | sed -e 's/[^A-Za-z0-9._-]/_/g')
    # skip trivial pathways
    EMPTY=$(curl -sS "$PC2/traverse.json?path=Pathway/pathwayComponent:Interaction&uri=$uri" | jq -r '.empty')
    if [ "$EMPTY" = "true" ] ; then
        EMPTY=$(curl -sS "$PC2/traverse.json?path=Pathway/pathwayOrder/stepProcess:Interaction&uri=$uri" | jq -r '.empty')
        if [ "$EMPTY" = "true" ] ; then
            echo "SKIPPED $uri (no Interactions)"
        fi
    fi
    ERR=$(curl -sS "$PC2/get?uri=$uri" > owl)
    case "$ERR" in
      *Exception* ) echo "FAILED $uri $ERR" ; continue ;;
    esac
    ERR=$(java -Xmx32g -jar paxtools.jar toSBGN owl $name.xml $* 2>&1 >>paxtools.log)
    case "$ERR" in
      *Exception* ) echo "FAILED $uri $ERR" ;;
      * ) echo "SAVED $uri" ;;
    esac
#break
  done
  page=$((page+1))
#break
done

echo "\nAll done!"
