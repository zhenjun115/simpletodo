class TasksController < ApplicationController
	def new
		# TODO: Sanitize title
		# TODO: Rails uuid
		@task = Task.new( { title: params[:title], uuid: SecureRandom.uuid } ) 
		if @task.save
			# debugger
			# @task
			render json: { tasks: [@task] }
		else
			render json: { op: 'add a new task', save: false }
		end	
	end

	def mark
		if params[:tag] != ""
			@tags = Tag.where( "name = ? AND task_id = ?", params[:tag], params[:uuid] )
			if @tags.count > 0
				Tag.destroy( @tags )
				render json: { checked: false }
			else
				@tags = Tag.create( { name: params[:tag], task_id: params[:uuid] } )
				render json: { checked:  @tags.save }
			end 
		else
			render json: { checked: false }
		end
	end

	def filte
		@tasks = Array.new()
		@tasks = Task.includes( :tags ).where( "title = ?", params[:title] ) unless params[:title] == nil || params[:title] == ""
		render json: { tasks: @tasks }
	end

	# TODO: code need to update
	def page

		# TODO: maybe not good
		result = Hash.new
		limit = params[:limit].to_i
		page = params[:page].to_i
		# TODO: maybe not good

		# TODO: maybe not good
		# @tasks = Task.includes( :tags ).order( created_at: :desc ).offset( page * limit )
		@tasks = Task.order( created_at: :desc ).offset( page * limit )
		# TODO: maybe not good

		result[:pages] = @tasks.count / limit + 1 unless @tasks.count % limit == 0
		@tasks = @tasks.limit( limit )
		result[:tasks] = @tasks

		i = 0
		result[:tags] = Hash.new

		# TODO: task can not access tags ?
		@tasks.each do |task|
			puts task.uuid
			result[:tags][i]  = Tag.where( "task_id = ?", task.uuid )
			i += 1
		end

		# TODO: code need to update
		render json: result
	end
end
