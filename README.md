# AdditiveSceneLoader

Cocos Creator scripts to automatic load other scenes when a scene is loaded. 

Example: You have four scenes: Main, A, B and C. Loading one of these automatic loads scene main who loads all other scenes. In the end, you have the four scenes loades regardless who scene is loaded. See the examples folder.

## Features

- Multiple scene groups
- Sort canvas order between scenes
- Callback for when all scenes from a group were loaded (add CallableAfterAdditiveLoad component)

## Install

Copy the contents of assets folder to your project assets folder.

For each scene group, do this:

1. One should be the group main scene. On this scene, put a root node with MainAdditiveSceneLoader. This root node should have all other scenes names from group at groupSceneNameArray property.  

2. On every other scene, put a root node with AdditiveSceneLoader with group main scene name at groupMainSceneName.

3. Besides widgets, all canvas from group can't contain other components because they will be destroyed when the load starts.

Add all scenes to build.

## Known Issues

Nodes can't have the same id between the scenes. If a node has the same id, an error will be throw.

Nodes with same id are generated when a scene is create as duplicate from another scene. So, the same nodes have the same id between both scenes.

This is easily solved duplicated the scene objects and deleting the original. The duplicates should be generated with a new node id. Tip: Put all root nodes on a other node, duplicate, delete the original and put the nodes again into scene root.