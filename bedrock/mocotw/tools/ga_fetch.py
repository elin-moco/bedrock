# -*- coding: utf-8 -*-

# import the Auth Helper class
import ga_auth


def main(argv = []):
    # Step 1. Get an analytics service object.
    SN = argv[1][2:].replace('-', '')
    print 'Fetching data of SN: ' + SN
    http = ga_auth.initialize_http()
    response, content = http.request('https://docs.google.com/spreadsheet/tq?tqx=out:csv&tq=select%%20*%%20where%%20A%%3D%s&key=0AhiWcjEYVWQKdFN6enZZYkw3MWl1YmRmbkNQd0xMbWc&gid=0' % SN)
    print content
    f = open('bedrock/newsletter/templates/newsletter/' + argv[1] + '/articles.csv', 'wb')
    f.write(content)
    f.close()

# main(sys.argv)
