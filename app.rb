require 'rack'
require 'oj'
require 'pry'
require 'pp'

Oj.mimic_JSON

class Content
    def self.fs_info (path)
        path = File.path(path)
        label = {
            path: path
        }
        if File.directory?(path)
            label[:type] = 'directory'
            children = Dir.children(path).map { |item| path + '/' + item }
            if children == []
                children = nil
            end
            info = {
                label: label,
                children: children
            }
        elsif File.file?(path)
            label[:type] = 'file'
            info = {
                label: label,
                children: nil
            }
        else
            info = nil
        end
        return info
    end
    
    def self.traverse_dir_tree (root)
        result = Hash.new
        stack = []
        stack.push root
        while (!stack.empty?)
            node = stack.pop
            tree = fs_info(node)
            if tree
                result[tree[:label][:path]] = tree
                stack += tree[:children] if tree[:children]
            end
        end
        return result
    end

    def self.call(env)
        path = env['PATH_INFO']
        headers = {'Content-Type' => 'application/json'}
        page = Oj.dump traverse_dir_tree('content')
        
        ['200', headers, [page]]
    end
end

app = Rack::Builder.app do
    use Rack::Static, :urls => ['/static']
    map '/api/content_index' do
        run Content
    end
end

Rack::Handler::WEBrick.run app

# env.each do |k, v|
#   page = page + k.to_s + ' => ' + v.to_s + "\n"
# end