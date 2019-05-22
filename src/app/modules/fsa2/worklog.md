## Saturday

I’m making progress on rendering the nodes in my computation tree. I’ve made each node its own svg and was able to get each one to be rendered within a flex container. CSS isn’t being applied for whatever reason - I have to look into that.

Turns out the CSS file was never linked to the external window. Big problem, it seems like the window has its own file structure that is completely separate from our main window’s CSS. I guess I’ll have to somehow copy over the CSS file? There seems to be a package that can convert a CSS file into a string, which I can then use to write into the header of the external window. For now, I’ll just hard code the CSS to ensure that it works.

## Sunday

I’ve started to look into the codebase for the edges and it seems like it’s completely dependent on the FSANode structure as that’s how the edges are rendered. I’m not sure how I would be able to use that for my program or how I would extract the edges from the StringTester class. I guess I’ll ask Andrew and hope for a response.

## Monday

I got a response from Andrew and I guess I have to deduce what edges are going to link together the nodes. Although I’m pretty sure this isn’t that big of a task, the problem of being able to render things not within a svg tag persists and I’m not sure how I am going to get this to render and more importantly, scale properly. Front-end is so annoying ugh. For now, I guess I’ll just get the edges and store them for easier access.