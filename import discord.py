import discord
from discord import Activity, ActivityType, User
from discord import member
from discord import permissions
from discord.ext import commands
client = commands.Bot(command_prefix=',')
@client.event
async def on_ready():
    print ("Hi")
client.run('token')