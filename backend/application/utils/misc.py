import os
from pathlib import PurePath





################################### FILE MANAGER ##################################

safe_directory_separator = '#'
forbidden_text_name = ['..', os.sep, safe_directory_separator]
forbidden_text_path = ['..']

def checkValidName(toCheck:str):
    for i in forbidden_text_name:
        if i in toCheck:
            return False
    return True


def checkValidPath(baseDir:str, check:str):
    for i in forbidden_text_path:
        if i in check:
            print(i, " found in path, rejecting")
            return False
    
    if not PurePath(check).is_relative_to(baseDir):
        print(check, " is not relative to ", baseDir)
        return False
    return True



################################ Task Management ##################################

currActiveTasks = []   # array of task_IDs for background tasks - so that they can be cancelled if required midway 
activeTaskLen = 0
currAbortedTasks =0  # Performance-friendly flag to check if one of the current active tasks might need to be cancelled if this is over 0

def addActiveTask(val:str):
    currActiveTasks.append(val)
    global activeTaskLen
    activeTaskLen+=1

def completeActiveTask(val:str):
    currActiveTasks.remove(val)
    global activeTaskLen
    activeTaskLen-=1



def checkValidTask(id:str):
    return currActiveTasks.index(id)
