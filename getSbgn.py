import requests
import os
import time

concurrent = 200
base_url = 'http://beta.pathwaycommons.org/pc2/get?format=sbgn&uri=';
base_dir = '/Users/dylanfong/Documents/workspace/work/pathway-commons-ecosystem/path-stat/sbgn/'

urls = [ url.strip() for url in open('top5.txt')]

broken_urls = []

for i in xrange(4191, 5038):
    print "processing ", i
    try:
        r = requests.get(base_url + urls[i], timeout=100)
        sbgn = r.text
        filename = os.path.join(base_dir, str(i))
        with open(filename, "w") as f:
            f.write(sbgn)
    except:
        print "could not process ", i
        print urls[i]
        broken_urls.append(urls[i])

print 'completed'
print 'broken urls: ', len(broken_urls)
print broken_urls



# def doWork():
#     while True:
#         url = q.get()
#         req = getreq(url)
#         doSomethingWithResult(req, url)
#         q.task_done()

# def getreq(url):
#     try:
#         r = requests.get(url)
#         return r.text
#     except:
#         return "error", url

# def doSomethingWithResult(req, url):
#     filename = os.path.join(baseDir, str(count))
#     count += 1
#     print filename
#     # with open(filename, "w") as f:
#     #     f.write(req)

# q = Queue(concurrent * 2)
# for i in range(concurrent):
#     t = Thread(target=doWork)
#     t.daemon = True
#     t.start()
# try:
#     for url in open('top5.txt'):
#         # print baseUrlGet + url
#         q.put(baseUrlGet + url)
#     q.join()
# except KeyboardInterrupt:
#     sys.exit(1)
