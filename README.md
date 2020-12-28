# SceneGroupLoader

Cocos Creator scripts to automatic load other scenes when a scene is loaded. 

Example: You have four scenes: Main, A, B and C. Loading one of these automatic loads scene main who loads all other scenes. In the end, you have the four scenes loades regardless who scene is loaded. See the examples folder.

## Features

- Multiple scene groups
- Sort canvas order between scenes
- Callback for when all scenes from a group were loaded (add CallableAfterGroupLoad component or extend GroupComponent)

## Install

Copy the contents of assets folder to your project assets folder.

For each scene group, do this:

1. One should be the group main scene. On this scene, put a root node with MainSceneGroupLoader. This root node should have all other scenes names from group at sceneNameArray property.  

2. On every other scene, put a root node with SceneGroupLoader with group main scene name at groupMainSceneName.

3. Besides widgets, all canvas from group can't contain other components because they will be destroyed when the load starts.

Add all scenes into build.

## Known Issues

### Nodes with same ID

Nodes can't have the same id between scenes. If this happen, an error will be throw displaying the name of the nodes with same ids.

Nodes with same id are generated when a scene is create as duplicate from another scene. So, the same nodes have the same id between both scenes.

This is easily solved duplicated the scene objects and deleting the original. The duplicates should be generated with a new node id. Tip: Put all root nodes on a other node, duplicate, delete the original and put the nodes again into scene root.

### OnEnable extra calls

On every scene loaded, all OnEnable of all currently loaded nodes are called.

### Extra load time

Each scene adds a little overhead for scene loading time. So, more scenes per group results in a bigger load time.

Examples on HTML5 platform, using a project with a good number of resources. Lowest load time in seconds:

| | 18 scenes | 10 scenes | 3 scenes |  
|---|---|---|---|
| Editor								| 23.9s | 18.2s | 11.9s | 
| Build running on local server 		| 4.8s  | 3.9s  | 2.9s  |
| Build running on external server		| 13.5s | 9.9s  | 9.0s  |