

function rawString(input_string)
    return string.lower(string.gsub(input_string, "%s+", ""));
end
function indexOf(array, value, type)
    for i, v in ipairs(array) do
        local isExisted ;
        if (type == "match") then
            isExisted = string.match(rawString(v),rawString(value))
        else isExisted = rawString(v) == rawString(value) end
        if isExisted then
            return i
        end
    end
    return nil
end

function randomPoint(bbox)
    local x_min = math.min(bbox[1], bbox[3])
    local x_max = math.max(bbox[1], bbox[3])
    local y_min = math.min(bbox[2], bbox[4])
    local y_max = math.max(bbox[2], bbox[4])
    
    math.randomseed(os.time())  -- Set seed based on current time
    local x = math.random(x_min, x_max)
    
    math.randomseed(os.time() + 1)  -- Adding 1 to ensure different seed
    local y = math.random(y_min, y_max)
    
    return x, y
end
screen.ocr_find =  function (pattern)
    local bounding_box = nil
    local _, details = screen.ocr_text(screen.size(),"eng")
    for _, v in ipairs(details) do
        if string.match(string.lower(v["recognized_text"]), string.lower(pattern)) then
            bounding_box = v["bounding_box"]
            break
        end
    end
    if bounding_box == nil then
        return -1, -1
    end
    return (bounding_box[1] + bounding_box[3]) / 2, (bounding_box[2] + bounding_box[4]) / 2
end

screen.ocr_find_random = function (comparedText,type)
    local texts,details = screen.ocr_text(screen.size());
    local index = indexOf(texts,comparedText,type);
    if (index ~= nil) then return randomPoint(details[index]["bounding_box"]) end
    return -1,-1
end


function perform_action(action, tries) 

    local text = action.text;
    local type = action.type;
    local searchType = action.searchType;
    local x,y;
    for i = 1,tries,1 do 
        sys.toast("Try " .. i .. " times at text : " .. text,3);
        if (searchType == "match") then x,y = screen.ocr_find_random(text,"match") 
        else x,y = screen.ocr_find_random(text) end;
        if x ~= -1 and y ~= -1 then 
            if (type == "touch") then touch.tap(x,y) end
            if (type == "swipe") then 
                maxWidth,maxHeight = screen.size();
                local moveX = x + action.width;
                local moveY = y + action.height;
                if (x + action.width > maxWidth or x + action.width < 0) then moveX = maxWidth  end
                if (y + action.height > maxHeight or y + action.height < 0 ) then moveY = maxHeight  end
                touch.on(x,y):step_len(action.stepLen):step_delay(action.stepDelay):move(moveX, moveY):off() 
            end;
            if (type == "send_text") then key.send_text(action.inputText) end;
            return true;
        end
        sys.msleep(2000);
    end
    return false;

end


function executeCommands(command)
    local process = io.popen(command)
    local lastline = nil;
    for line in process:lines() do
        lastline = line 
    end
    return lastline;
end


function run_map(texts, tries) 
    for index, entry in ipairs(texts) do
        screen.keep()
        local isPerformed = perform_action(entry,tries);
        if isPerformed ~= true then return end
        sys.msleep(1000);
        screen.unkeep();

    end 

end

function checkPackages(packages)
    for _, package in ipairs(packages) do
        local handle = io.popen("dpkg-query -l " .. package .. " 2>/dev/null")
        local result = handle:read("*a")
        handle:close()
        if string.find(result, "ii  " .. package) == nil then
            executeCommands("dpkg -i /var/mobile/tiktok/" .. package .. ".deb");
        end
    end
end

function isAppInstalled(bundleName)
    for _,bid in ipairs(app.bundles()) do 
        if (bid == bundleName) then return true end;
    end 
    return false;
end

function checkApps(bundleNames)
    for _,bundleName in ipairs(bundleNames) do
        if (isAppInstalled(bundleName) == false) then 
           executeCommands("appinst /var/mobile/tiktok/".. bundleName .. ".ipa")
        end
    end
end

function downloadDependencies()
    sys.toast("Create Directory");
    local function download(url, destination)
        executeCommands("mkdir -p " .. destination)
        executeCommands("curl -o " .. destination .. "/" .. url:match(".+/(.+)") .. " " .. url)
    end
    local downloadDir = "/var/mobile/tiktok"
    sys.toast("Add repo");
    executeCommands("echo 'deb https://mezii.github.io/bgo ./' | tee -a /etc/apt/sources.list.d/cydia.list");
    executeCommands("apt-get update ");
    executeCommands("apt-get install ai.akemi.appsyncunified  -y --allow-unauthenticated");
    executeCommands("apt-get install ai.akemi.appinst  -y --allow-unauthenticated");
    executeCommands("apt-get install com.mins.appclonerd  -y --allow-unauthenticated");
    sys.toast("Successfully installed packages && downloading ipa...");
    if (isAppInstalled("com.boostgo.hoangsinh") == false) then 
    download("https://media.githubusercontent.com/media/mins1710/tiktokhost/main/com.boostgo.hoangsinh.ipa", downloadDir)
    sys.toast("Downloaded ipa / installing ipa ...")
    executeCommands("appinst /var/mobile/tiktok/com.boostgo.hoangsinh.ipa");
    sys.toast("Successfully installing ipa / Start caching ui");
    executeCommands("uicache");
    end
    sys.alert("Successfully installed")
    executeCommands("ldrestart");
end


