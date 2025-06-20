local plr = game.Players.LocalPlayer
local gui = Instance.new("ScreenGui")
gui.Name = "ScreenGui"
gui.Parent = plr:WaitForChild("PlayerGui")
gui.ResetOnSpawn = false

-- Money Farm Toggle Button
local act = false
local But2 = Instance.new("TextButton")
But2.Parent = gui
But2.Text = "money farm"
But2.Size = UDim2.new(0, 100, 0, 50)
But2.Position = UDim2.new(0, 10, 0, 10)
But2.BackgroundColor3 = Color3.new(1, 0, 0)

But2.MouseButton1Click:Connect(function()
    act = not act
    But2.BackgroundColor3 = act and Color3.new(0, 1, 0) or Color3.new(1, 0, 0)
end)

-- Jump Button (Y = 0.4)
local But = Instance.new("TextButton")
But.Parent = gui
But.Text = "Jump"
But.Size = UDim2.new(0, 120, 0, 120)
But.Position = UDim2.new(0.8, 0, 0.4, 0)  -- updated Y
But.BackgroundColor3 = Color3.new(0, 0, 0)
But.BackgroundTransparency = 0.5

But.MouseButton1Click:Connect(function()
    local char = plr.Character
    if char and char:FindFirstChild("HumanoidRootPart") then
        char.HumanoidRootPart:ApplyImpulse(Vector3.new(0, 200, 0))
    end
end)

-- Coin Teleporting Logic
workspace.ChildAdded:Connect(function(c)
    task.wait(0.1)
    if not act then return end

    for _, i in pairs(c:GetDescendants()) do
        if i.Name == "Coin" and i:IsA("BasePart") and i:IsDescendantOf(workspace) then
            if i.Position.Y > 0 then
                local char = plr.Character
                if char and char:FindFirstChild("HumanoidRootPart") then
                    local hrp = char.HumanoidRootPart
                    hrp.Anchored = true
                    hrp.CFrame = i.CFrame + Vector3.new(0, 2, 0)
                    task.wait(1)
                    hrp.Anchored = false
                end
            end
        end
    end
end)
