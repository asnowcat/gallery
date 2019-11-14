#!/usr/bin/env ruby
require 'rack'
require 'oj'
require 'bcrypt'
require 'securerandom'
require 'pry'

Oj.mimic_JSON

class MediaIndex
    def self.dir_children(path)
        if File.directory?(path)
            files = []
            directories = []
            children = Dir.children(path).each do |item|
                child = File.join(path, item)
                if File.directory? child
                    child += '/'
                    directories.push child
                else
                    files.push child
                end
            end
            return { files: files, directories: directories }
        end
    end

    def self.traverse_dir_tree(root)
        result = Hash.new
        stack = [root]
        while (!stack.empty?)
            node = stack.pop
            path = File.path(node)
            children = dir_children(path)
            if children
                result[path] = children
                stack += children[:directories]
            end
        end
        return result
    end

    def self.call(env)
        request = Rack::Request.new(env)
        response = Rack::Response.new
#        File.foreach('session_db') do |line|
#            if ((line != '#session_db' &&
#                    request.cookies['session'].include?(line)) ||
#                    ENV['RACK_ENV'] == 'development')
#
#                break
#            else
#                response.status = 403
#            end
#        end
        page = Oj.dump traverse_dir_tree('media/')

        response.status = 200
        response['Content-Type'] = 'application/json'
        response.write(page)
        return response.finish()
    end
end

app = Rack::Builder.app do  
    use Rack::Static, :urls => {"/" => 'index.html'}, :root => 'public'
    use Rack::Static, :urls => ["/public", "/media"]
    map '/rpc/index/media' do
        run MediaIndex
    end
end

Rack::Handler::WEBrick.run app, Host: 'localhost', Port: '8080'
