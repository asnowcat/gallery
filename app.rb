require 'rack'
require 'oj'

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
        headers = {'Content-Type' => 'application/json'}
        page = Oj.dump traverse_dir_tree('media/')

        ['200', headers, [page]]
    end
end

app = Rack::Builder.app do
    use Rack::Static, :urls => {"/" => 'index.html'}, :root => 'public'
    use Rack::Static, :urls => ["/public"]
    map '/rpc/index/media' do
        run MediaIndex
    end
end

Rack::Handler::WEBrick.run app

