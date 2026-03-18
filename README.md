# Tasks left

# To test the game:
- Open a terminal in /Users/rion/Desktop/Github/15113-hw7
- Run python3 -m http.server 8000
- Visit http://localhost:8000 in your web browser.

--------

# General vision for project
Recreate the game fireboy and Watergirl. 
Core Gameplay Mechanics: Each character is immune to their own element but instantly dies if they touch the opposing one.
- Fireboy: Can walk through lava/fire pools.Dies instantly if he touches water
- Watergirl: Can walk through water/ice pools.Dies instantly if she touches lava.
- The Green Ooze: Both characters die if they touch the toxic green chemical pits.

## Controls & Movement
The game is designed for "couch co-op" on a single keyboard, with each character having a dedicated set of keys:
- Fireboy: left and right arrow keys to move left and right. Up arrow to jump. 
- Watergirl: A and D keys to move left and right. W key to jump

## The Goal
Both characters must reach their respective doors (marked with "F" for Fire and "W" for Water) at the exit of the level. If one character dies, the level immediately fails and must be restarted from the beginning.

The final score is determined by three factors:
- Did both characters survive?
- Did you collect all gems?
- How fast did you finish? (based on the clock counting upwards at the top middle of the screen)

## Key Features & Puzzle Elements
The "Temples" are filled with mechanical obstacles that require coordinated timing:
- Levers and Buttons: One character must stand on a button or hold a lever (stand by the lever) to keep a door open while the other passes through. Levers will stay in place after you pull them, but buttons will not.
- Moving Platforms: These are controlled by pulleys. One character needs to stand on one side of a lift to weigh it down so that the other can reach a higher ledge.
- Gems: Levels contain red gems (for Fireboy) and blue gems (for Watergirl). While optional for finishing the level, collecting them is required to earn the "A" rank.
