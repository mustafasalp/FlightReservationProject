// ITokenService.cs
using Backend.Models;
using System.Collections.Generic;

namespace Backend.Services
{
    public interface ITokenService
    {
        string CreateToken(ApplicationUser user, IList<string> roles);
    }
}
